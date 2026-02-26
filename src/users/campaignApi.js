import axiosInstance from "../utils/axiosInstance";

export async function getCampaignReport() {
    try {
        const response = await axiosInstance.get('/campaign/campaign-report');

        let campaignData = [];
        if (Array.isArray(response.data.data)) {
            campaignData = response.data.data;
        } else if (Array.isArray(response.data)) {
            campaignData = response.data;
        } else {
            console.warn('API response is not an array!', response.data);
            return [];
        }

        return campaignData.map(item => ({
            campaignid: item.campaignid,
            campaign_title: item.campaign_title,
            langcode: item.langcode,
            template_type: item.template_type,
            templateid: item.tempid,
            total: item.total,
            sent: item.sent,
            delivered: item.delivered,
            dbtick: item.dbtick,
            failed: item.failed,
            entrytime: item.entrytime,
            campaign_status: item.campaign_status
        }));
    } catch (error) {
        console.error('Error fetching campaign report:', error);
        return [];
    }
}
export const uploadCampaignCSV = async (formData) => {
    try {
        const response = await axiosInstance.post(
            "/csv/upload",
            formData
        )

        return response.data.data

    } catch (error) {
        console.error(
            "Upload failed:",
            error.response?.data.data || error.message
        )
        throw error
    }
}


