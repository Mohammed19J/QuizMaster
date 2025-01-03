import Header from "../components/header";
import Footer from "../components/footer";

export default function MainLayout({ children }) {
    return (
        <div class="min-h-[100vh] flex flex-col">
            <Header />
            <div class="grow py-4 max-w-[1000px] mx-auto w-full">
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    );
}
