import AttachApi from "@/components/AttachApi";
import protectedRoute from "@/components/hoc/protectedRoute";

const AttachApiPage = () => {
    return (
        <AttachApi />
    )
}

export default protectedRoute(AttachApiPage);