import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { BackendUrl } from "@/constants/backendUrl";
import Loader from "@/components/Loader";

interface DocumentUploadProps {
  label: string;
  onUpload: (file: DocumentPicker.DocumentPickerAsset) => void;
  uploadedFileName: string | null;
  onRemove: () => void;
  existingFileUrl: string | null;
  onRemoveExisting: () => void;
  fieldName: string;
}

interface HealthDocument {
  _id?: string;
  UserId?: string;
  LabReport?: string;
  MedicalPrescription?: string;
  ScanReports?: string;
  BloodTestReports?: string;
  HealthCheckUpReports?: string;
  PrescriptionReports?: string;
  Others?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const DocumentUploader: React.FC<DocumentUploadProps> = ({
  label,
  onUpload,
  uploadedFileName,
  onRemove,
  existingFileUrl,
  onRemoveExisting,
  fieldName,
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;
      const file = result.assets[0];
      if (file) {
        onUpload(file);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleRemoveExisting = () => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this file?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => onRemoveExisting(),
        },
      ]
    );
  };

  return (
    <View style={styles.uploadContainer}>
      <Pressable onPress={pickDocument} style={styles.uploadButton}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.uploadText}>Upload</Text>
      </Pressable>

      {/* Show existing file with remove button */}
      {existingFileUrl && !uploadedFileName && (
        <View style={styles.uploadedFileContainer}>
          <Text style={styles.uploadedFileName}>
            {existingFileUrl.split(/[\\/]/).pop()}
          </Text>
          {/* {existingFileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <Image
              source={{
                uri: `${BackendUrl}/${existingFileUrl.replace(/\\/g, "/")}`,
              }}
              style={{ width: 50, height: 50 }}
            />
          ) : (
            <Text style={styles.fileTypeText}>📄 File</Text>
          )} */}
          <Pressable onPress={handleRemoveExisting} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </View>
      )}

      {/* Show newly uploaded file */}
      {uploadedFileName && (
        <View style={styles.uploadedFileContainer}>
          <Text style={styles.uploadedFileName}>{uploadedFileName}</Text>
          <Pressable onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const UpdateHealthHistory: React.FC = () => {
  const userData = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const [labReports, setLabReports] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [medicalPrescriptions, setMedicalPrescriptions] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [imagingReports, setImagingReports] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [bloodTestReports, setBloodTestReports] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [healthCheckupDocuments, setHealthCheckupDocuments] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [others, setOthers] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [existingDocuments, setExistingDocuments] =
    useState<HealthDocument | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isdelete, setisdelete] = useState(false);

  // Fetch existing documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}/api/user/userDocuments`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (response.data.success) {
          setExistingDocuments(response.data.data);
          console.log("dddddddddddddd", response.data.data);
        } else {
          setExistingDocuments(null);
        }
      } catch (error: any) {
        console.log(
          "Error fetching documents:",
          error.response?.data || error.message
        );
        setExistingDocuments(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [userData.token]);

  const handleRemoveExistingFile = async (fieldName: keyof HealthDocument) => {
    try {
      if (!existingDocuments?._id) {
        Alert.alert("Error", "Document ID not found");
        return;
      }

      const response = await axios.delete(
        `${BackendUrl}/api/user/userDocuments`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: {
            field: fieldName,
          },
        }
      );

      if (response.data.success) {
        setExistingDocuments(
          (prev) =>
            ({
              ...prev,
              [fieldName]: "",
            } as HealthDocument)
        );
        Alert.alert("Success", "File removed successfully");
      } else {
        Alert.alert("Error", response.data.message || "Failed to remove file");
      }
    } catch (error: any) {
      console.log("Error removing file:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while removing the file"
      );
    }
  };

  const handleDeleteAllDocuments = async () => {
    if (!existingDocuments?._id) {
      Alert.alert("Info", "No documents to delete");
      return;
    }

    Alert.alert(
      "Confirm Delete All",
      "Are you sure you want to delete all your health documents?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          onPress: async () => {
            setIsLoading(true)
            try {
              const response = await axios.delete(
                `${BackendUrl}/api/user/userDocuments`,
                {
                  headers: {
                    Authorization: `Bearer ${userData.token}`,
                  },
                }
              );

              if (response.data.success) {
                setExistingDocuments(null);
                Alert.alert("Success", "All documents deleted successfully");
              } else {
                Alert.alert(
                  "Error",
                  response.data.message || "Failed to delete documents"
                );
              }
              setisdelete(false);
            } catch (error: any) {
              console.log("Error deleting documents:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "An error occurred while deleting documents"
              );
            }finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      console.log("labReportssss", labReports);
      console.log("medicalPrescriptionssss", medicalPrescriptions);

      // Add all files to formData
      if (labReports) {
        formData.append("LabReport", {
          uri: labReports.uri,
          type: labReports.mimeType,
          name: labReports.name,
        } as any);
      }
      if (medicalPrescriptions) {
        formData.append("MedicalPrescription", {
          uri: medicalPrescriptions.uri,
          type: medicalPrescriptions.mimeType,
          name: medicalPrescriptions.name,
        } as any);
      }
      if (imagingReports) {
        formData.append("ScanReports", {
          uri: imagingReports.uri,
          type: imagingReports.mimeType,
          name: imagingReports.name,
        } as any);
      }
      if (bloodTestReports) {
        formData.append("BloodTestReports", {
          uri: bloodTestReports.uri,
          type: bloodTestReports.mimeType,
          name: bloodTestReports.name,
        } as any);
      }
      if (healthCheckupDocuments) {
        formData.append("HealthCheckUpReports", {
          uri: healthCheckupDocuments.uri,
          type: healthCheckupDocuments.mimeType,
          name: healthCheckupDocuments.name,
        } as any);
      }
      if (others) {
        formData.append("Others", {
          uri: others.uri,
          type: others.mimeType,
          name: others.name,
        } as any);
      }

      // Determine if we're updating or creating new
      const isUpdate = existingDocuments?._id;
      const endpoint = `${BackendUrl}/api/user/userDocumentUploadOrUpdate`;
      console.log("sssssssssss");

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Alert.alert("Success", "Documents processed successfully!");
        setisdelete(true)
        // Refresh the documents
        const refreshResponse = await axios.get(
          `${BackendUrl}/api/user/userDocuments`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setExistingDocuments(refreshResponse.data.data);
        // Clear all upload states
        setLabReports(null);
        setMedicalPrescriptions(null);
        setImagingReports(null);
        setBloodTestReports(null);
        setHealthCheckupDocuments(null);
        setOthers(null);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to process documents"
        );
      }
    } catch (error: any) {
      console.log("Error processing documents:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while processing documents"
      );
    }finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return <Loader />;
  }
  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Health History</Text>

          {/* Delete All Button - Only show if documents exist */}

          {/* {existingDocuments && (
            <Pressable
              style={styles.deleteAllButton}
              onPress={handleDeleteAllDocuments}
            >
              <Text style={styles.deleteAllButtonText}>
                Delete All Documents
              </Text>
            </Pressable>
          )} */}

          {(existingDocuments?.BloodTestReports !== "" ||
            existingDocuments?.HealthCheckUpReports !== "" ||
            existingDocuments?.LabReport !== "" ||
            existingDocuments?.MedicalPrescription !== "" ||
            existingDocuments?.Others !== "" ||
            existingDocuments?.ScanReports !== "") &&
          isdelete === true ? (
            <Pressable
              style={styles.deleteAllButton}
              onPress={handleDeleteAllDocuments}
            >
              <Text style={styles.deleteAllButtonText}>
                Delete All Documents
              </Text>
            </Pressable>
          ) : (
            ""
          )}

          <DocumentUploader
            label="Lab Reports (Diabetes)"
            onUpload={setLabReports}
            uploadedFileName={labReports?.name || null}
            onRemove={() => setLabReports(null)}
            existingFileUrl={existingDocuments?.LabReport || null}
            onRemoveExisting={() => handleRemoveExistingFile("LabReport")}
            fieldName="LabReport"
          />
          <DocumentUploader
            label="Medical Prescriptions"
            onUpload={setMedicalPrescriptions}
            uploadedFileName={medicalPrescriptions?.name || null}
            onRemove={() => setMedicalPrescriptions(null)}
            existingFileUrl={existingDocuments?.MedicalPrescription || null}
            onRemoveExisting={() =>
              handleRemoveExistingFile("MedicalPrescription")
            }
            fieldName="MedicalPrescription"
          />
          <DocumentUploader
            label="Imaging Reports (X-rays, MRIs)"
            onUpload={setImagingReports}
            uploadedFileName={imagingReports?.name || null}
            onRemove={() => setImagingReports(null)}
            existingFileUrl={existingDocuments?.ScanReports || null}
            onRemoveExisting={() => handleRemoveExistingFile("ScanReports")}
            fieldName="ScanReports"
          />
          <DocumentUploader
            label="Upload Blood Test Reports"
            onUpload={setBloodTestReports}
            uploadedFileName={bloodTestReports?.name || null}
            onRemove={() => setBloodTestReports(null)}
            existingFileUrl={existingDocuments?.BloodTestReports || null}
            onRemoveExisting={() =>
              handleRemoveExistingFile("BloodTestReports")
            }
            fieldName="BloodTestReports"
          />
          <DocumentUploader
            label="Upload Health Check-up Documents"
            onUpload={setHealthCheckupDocuments}
            uploadedFileName={healthCheckupDocuments?.name || null}
            onRemove={() => setHealthCheckupDocuments(null)}
            existingFileUrl={existingDocuments?.HealthCheckUpReports || null}
            onRemoveExisting={() =>
              handleRemoveExistingFile("HealthCheckUpReports")
            }
            fieldName="HealthCheckUpReports"
          />
          <DocumentUploader
            label="Others"
            onUpload={setOthers}
            uploadedFileName={others?.name || null}
            onRemove={() => setOthers(null)}
            existingFileUrl={existingDocuments?.Others || null}
            onRemoveExisting={() => handleRemoveExistingFile("Others")}
            fieldName="Others"
          />

          <View style={styles.buttonContainer}>
            <Pressable style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#D8F5FF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: { flex: 1, padding: 20, backgroundColor: "#D8F5FF" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  uploadContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "black", marginBottom: 5 },
  uploadButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadText: { color: "black", fontSize: 16 },
  uploadedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
  },
  uploadedFileName: {
    fontSize: 14,
    color: "black",
    flex: 1,
    marginRight: 10,
  },
  fileTypeText: {
    fontSize: 24,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  prevButton: {
    backgroundColor: "#FFFFFF",
    width: 80,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  nextButtonText: { fontSize: 18, fontWeight: "bold", color: "black" },
  deleteAllButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteAllButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateHealthHistory;
