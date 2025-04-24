import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { BackendUrl } from "@/constants/backendUrl";
import { completeOnboarding } from "../components/Redux/authSlice";
import { router } from "expo-router";
import { login } from "@/components/Redux/authSlice";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DocumentUploadProps {
  label: string;
  onUpload: (file: DocumentPicker.DocumentPickerAsset) => void;
  uploadedFileName: string | null;
  onRemove: () => void;
}

interface OnboardingThreeProps {
  setOnboardingFlag: (value: Number) => void;
}

interface RootState {
  auth: {
    token: string;
    // Add other auth state properties here as needed
  };
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
      <View>
        <Pressable
          onPress={() => pickDocument(onUpload)}
          style={styles.uploadButton}
        >
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.uploadText}>Upload</Text>
        </Pressable>
      </View>
      {/* Show uploaded file and remove button */}
      <View>
        {uploadedFileName && (
          <View style={styles.uploadedFileContainer}>
            <View style={styles.uploadedFileNameContainer}>
              <Text style={styles.uploadedFileName} numberOfLines={1}>
                Uploaded: {uploadedFileName}
              </Text>
            </View>
            <View style={styles.removeButtonContainer}>
              <Pressable onPress={onRemove} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// OnboardingThree Component
const OnboardingThree: React.FC<OnboardingThreeProps> = ({ setOnboardingFlag }) => {
  const userData = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  // Loader
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
    try {
      const formData = new FormData();
  
      // Helper function to append files safely
      const appendIfExists = (fieldName: string, file: DocumentPicker.DocumentPickerAsset | null) => {
        if (file) {
          // Create a proper file object for React Native
          const fileObject = {
            uri: file.uri,
            type: file.mimeType || 'application/octet-stream', // fallback type
            name: file.name || 'file',
          };
          formData.append(fieldName, fileObject as any);
        }
      };
  
      // Append files only if they exist
      appendIfExists("LabReport", labReports);
      appendIfExists("MedicalPrescription", medicalPrescriptions);
      appendIfExists("ScanReports", imagingReports);
      appendIfExists("BloodTestReports", bloodTestReports);
      appendIfExists("HealthCheckUpReports", healthCheckupDocuments);
      appendIfExists("PrescriptionReports", prescriptionDocuments);
      appendIfExists("Others", others);
  
      // Check if any files were actually added
      const anyFilesUploaded = [
        labReports, 
        medicalPrescriptions, 
        imagingReports, 
        bloodTestReports,
        healthCheckupDocuments,
        prescriptionDocuments,
        others
      ].some(file => file !== null);
  
      const response = await axios.post(
        `${BackendUrl}/api/user/userDocumentUplaod`,
        anyFilesUploaded ? formData : {}, // Send empty object if no files
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': anyFilesUploaded 
              ? 'multipart/form-data' 
              : 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        dispatch(login(response.data.token));
      }
    } catch (error: any) {
      console.log("Error details:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      {isLoading ? (
        <Loader /> 
      ) : (
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
            {/* <DocumentUploader
              label="Upload Prescription Documents"
              onUpload={setPrescriptionDocuments}
              uploadedFileName={prescriptionDocuments?.name || null}
              onRemove={() => setPrescriptionDocuments(null)}
            /> */}
            <DocumentUploader
              label="Others"
              onUpload={setOthers}
              uploadedFileName={others?.name || null}
              onRemove={() => setOthers(null)}
            />

<View style={styles.buttonContainer}>
          {/* Previous Button with Icon */}
          <Pressable
            style={styles.prevButton}
            onPress={() => setOnboardingFlag(1)}
          >
            <Entypo name="arrow-left" size={24} color="black" />
          </Pressable>

          {/* Next Button with Text */}
          <Pressable style={styles.nextButton} onPress={() => handleSubmit()}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
          </View>
        </ScrollView>
      )}
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

  uploadContainer: { marginBottom: 15, width: "100%" },
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
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  uploadedFileNameContainer: {
    width: "60%", // 60% width for the file name
  },
  uploadedFileName: {
    fontSize: 14,
    color: "black",
    flexShrink: 1, // Allow text to shrink and wrap
  },
  removeButtonContainer: {
    width: "40%", // 40% width for the remove button
    alignItems: "flex-end", // Align button to the right
  },
  removeButton: {
    backgroundColor: "#3ECD7E",
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

export default OnboardingThree;