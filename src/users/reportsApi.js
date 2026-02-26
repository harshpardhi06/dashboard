import axiosInstance from "../utils/axiosInstance";

export async function downloadCSVReport(campaignId) {
    try {
        const response = await axiosInstance.get(
            `/csv-reports/download-joined-report?campaignId=${campaignId}`,
            {
                responseType: "blob",
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getCampaignId() {
    try {
        const response = await axiosInstance.get(`/csv/data`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}