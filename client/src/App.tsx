import { useModel } from "./context/ModelContext";

function App() {

    const { model } = useModel();

    if (model.authLoading) {
        return <div>Loading...</div>;
    }

    // if (!model.isAuthenticated) {
    //     return <LoginPage />;
    // }

    // return <BoardPage />;
}

export default App
