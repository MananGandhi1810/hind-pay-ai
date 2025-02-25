import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="h-full-w-nav flex flex-col">
            <header className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl mb-4">HindPayAI</h1>
                <p className="text-xl mb-8">
                    Experience secure and instant transactions like never
                    before.
                </p>
                <div className="flex gap-4">
                    <Button className="bg-secondary duration-300" asChild>
                        <Link to="/register">Get Started</Link>
                    </Button>
                    <Button className="bg-secondary duration-300" asChild>
                        <Link to="/history">View History</Link>
                    </Button>
                </div>
            </header>
        </div>
    );
}

export default Home;
