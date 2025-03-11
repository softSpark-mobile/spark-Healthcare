import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { BackendUrl } from "@/constants/backendUrl";
import { completeOnboarding } from "../components/Redux/authSlice";

interface DocumentUploadProps {
  label: string;
  onUpload: (file: DocumentPicker.DocumentPickerAsset) => void;
  uploadedFileName: string | null;
  onRemove: () => void;
}

// Function to pick a document
const pickDocument = async (
  onUpload: (file: DocumentPicker.DocumentPickerAsset) => void
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.canceled) return;
    const file = result.assets[0];
    if (file) {
      onUpload(file);
    }
  } catch (error) {
    console.error("Error picking document:", error);
  }
};

// DocumentUploader Component
const DocumentUploader: React.FC<DocumentUploadProps> = ({
  label,
  onUpload,
  uploadedFileName,
  onRemove,
}) => {
  return (
    <View style={styles.uploadContainer}>
      <Pressable
        onPress={() => pickDocument(onUpload)}
        style={styles.uploadButton}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.uploadText}>Upload</Text>
      </Pressable>

      {/* Show uploaded file and remove button */}
      {uploadedFileName && (
        <View style={styles.uploadedFileContainer}>
          <Text style={styles.uploadedFileName}>
            Uploaded: {uploadedFileName}
          </Text>
          <Pressable onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// updateHealthHistory Component
const updateHealthHistory: React.FC = () => {
//   const userData = useSelector((state) => state.auth);
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
  const [prescriptionDocuments, setPrescriptionDocuments] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [others, setOthers] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // Handle form submission
  const handleSubmit = async () => {
    console.log(others, "1");
    console.log(prescriptionDocuments, "2");
    console.log(healthCheckupDocuments, "3");
    console.log(bloodTestReports, "4");
    console.log(imagingReports, "5");
    console.log(medicalPrescriptions, "6");
    console.log(labReports, "7");

    // try {
    //   const formData = new FormData();

    //   if (labReports) {
    //     formData.append("LabReport", {
    //       uri: labReports.uri,
    //       type: labReports.mimeType,
    //       name: labReports.name,
    //     });
    //   }
    //   if (medicalPrescriptions) {
    //     formData.append("MedicalPrescription", {
    //       uri: medicalPrescriptions.uri,
    //       type: medicalPrescriptions.mimeType,
    //       name: medicalPrescriptions.name,
    //     });
    //   }
    //   if (imagingReports) {
    //     formData.append("ScanReports", {
    //       uri: imagingReports.uri,
    //       type: imagingReports.mimeType,
    //       name: imagingReports.name,
    //     });
    //   }
    //   if (bloodTestReports) {
    //     formData.append("BloodTestReports", {
    //       uri: bloodTestReports.uri,
    //       type: bloodTestReports.mimeType,
    //       name: bloodTestReports.name,
    //     });
    //   }
    //   if (healthCheckupDocuments) {
    //     formData.append("HealthCheckUpReports", {
    //       uri: healthCheckupDocuments.uri,
    //       type: healthCheckupDocuments.mimeType,
    //       name: healthCheckupDocuments.name,
    //     });
    //   }
    //   if (prescriptionDocuments) {
    //     formData.append("PrescriptionReports", {
    //       uri: prescriptionDocuments.uri,
    //       type: prescriptionDocuments.mimeType,
    //       name: prescriptionDocuments.name,
    //     });
    //   }
    //   if (others) {
    //     formData.append("Others", {
    //       uri: others.uri,
    //       type: others.mimeType,
    //       name: others.name,
    //     });
    //   }

    //   const response = await axios.post(
    //     `${BackendUrl}/api/user/userDocumentUplaod`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${userData.token}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   if (response.status === 200) {
    //     dispatch(completeOnboarding());
    //   }
    // } catch (error) {
    //   console.log(error, "error");
    // }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Health History</Text>

          <DocumentUploader
            label="Lab Reports (Diabetes)"
            onUpload={setLabReports}
            uploadedFileName={labReports?.name || null}
            onRemove={() => setLabReports(null)}
          />
          <DocumentUploader
            label="Medical Prescriptions"
            onUpload={setMedicalPrescriptions}
            uploadedFileName={medicalPrescriptions?.name || null}
            onRemove={() => setMedicalPrescriptions(null)}
          />
          <DocumentUploader
            label="Imaging Reports (X-rays, MRIs)"
            onUpload={setImagingReports}
            uploadedFileName={imagingReports?.name || null}
            onRemove={() => setImagingReports(null)}
          />
          <DocumentUploader
            label="Upload Blood Test Reports"
            onUpload={setBloodTestReports}
            uploadedFileName={bloodTestReports?.name || null}
            onRemove={() => setBloodTestReports(null)}
          />
          <DocumentUploader
            label="Upload Health Check-up Documents"
            onUpload={setHealthCheckupDocuments}
            uploadedFileName={healthCheckupDocuments?.name || null}
            onRemove={() => setHealthCheckupDocuments(null)}
          />
          <DocumentUploader
            label="Upload Prescription Documents"
            onUpload={setPrescriptionDocuments}
            uploadedFileName={prescriptionDocuments?.name || null}
            onRemove={() => setPrescriptionDocuments(null)}
          />
          <DocumentUploader
            label="Others"
            onUpload={setOthers}
            uploadedFileName={others?.name || null}
            onRemove={() => setOthers(null)}
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.prevButton}
            //   onPress={() => setOnboardingFlag(1)}
            >
              <Entypo name="arrow-left" size={24} color="black" />
            </Pressable>
            <Pressable style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
   fullScreenContainer: {
    flex: 1,
    backgroundColor: "#D8F5FF", // Full-screen background color
  },
  scrollContainer: {
    flexGrow: 1, // Allows ScrollView to take full height
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
  uploadedFileName: { fontSize: 14, color: "black", flex: 1 },
  removeButton: {
    backgroundColor: "#3ECD7E",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});

export default updateHealthHistory;
