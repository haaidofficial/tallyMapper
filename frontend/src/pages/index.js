import dynamic from "next/dynamic";

const ManageEnterprises = dynamic(() => import("@/components/ManageEnterprises"));

function Home() {
    return <ManageEnterprises />;
}

export default Home;