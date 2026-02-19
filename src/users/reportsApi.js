import axiosInstance from "../utils/axiosInstance";

export async function downloadCSVReport(campaignId) {
    try {
        const response = await axiosInstance.get(
            `/csv-reports/download-joined-report?campaignId=${campaignId}`,
            {
                responseType: "blob", // VERY IMPORTANT
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
}
