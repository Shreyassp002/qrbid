// app/page.js
import Link from "next/link"

export default function LandingPage() {
    return (
        <div>
            {/* Your landing page content */}
            <main>
                <h1>Welcome to QR Auction</h1>
                <p>Bid to control where the QR code points!</p>

                {/* Call to action to go to auction */}
                <Link href="/auction">
                    <button>Enter Auction</button>
                </Link>
            </main>
        </div>
    )
}
