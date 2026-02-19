import axiosInstance from "../utils/axiosInstance";

export const getScheduleCount = async () => {
    const res = await axiosInstance.get('/schedule/count');
    return res.data.data;
};


export const getScheduleStatusCounts = async () => {
    const res = await axiosInstance.get('/log/status-counts');
    return res.data;
};

export const getMBUResponseCounts = async () => {
    const res = await axiosInstance.get('/MBUResponse/count-response');
    return res.data
};

export const getScheduleStatusHistory = async () => {
    const res = await axiosInstance.get('/schedule-status/status');
    return res.data;
};