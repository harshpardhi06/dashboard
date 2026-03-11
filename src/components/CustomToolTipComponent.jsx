import styled from "@emotion/styled";
import { Tooltip, tooltipClasses } from "@mui/material";

export const CustomToolTipComponent = styled(
    ({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    )
)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme?.workflowBuilder?.tooltipBackground || "#333",
        color: theme?.workflowBuilder?.tooltipColor || "#fff",
        boxShadow: theme?.shadows?.[1] || "0px 2px 6px rgba(0,0,0,0.2)",
        fontSize: 11,
    },
}));
