import protectedRoute from "@/components/hoc/protectedRoute";
import TransformTallyData from "@/components/TransformTallyData";

const transformTallyData = () => {
    return (
        <>
            <TransformTallyData />
        </>
    )
}

export default protectedRoute(transformTallyData);