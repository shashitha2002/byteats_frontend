// app/page.tsx
import Link from 'next/link';
import './globals.css'; 

export default function Home() {
  return (
    <div>
      <div>
        <div className="cta-box">
          <p className="cta-text">Proceed to checkout to place your order and make payment.</p>
          
          <Link href="/user/payment/checkout" className="btn">
            Go to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}