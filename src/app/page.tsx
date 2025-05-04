import Image from "next/image";
import Footer from "./footer/page";
import Header from "./header/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center h-94 bg-[url('/deliveryFood.jpg')] bg-cover bg-center">
          <h1 className="text-5xl font-bold">Welcome to BYTEats</h1>
          <p className="mt-4 text-lg">
            Your one-stop solution for food delivery!
          </p>
        </div>

        <div className="flex flex-col md:flex-row m-12 items-center justify-between p-6 md:p-12 gap-6">
          <Image
            src="/hamburger.png"
            height={400}
            width={400}
            alt="Food Delivery"
          />
          <div className="text-black p-6 text-center md:text-left max-w-xl">
            <h2 className="text-3xl font-bold mb-4">
              Choose from a variety of cuisines
            </h2>
            <p className="text-lg leading-relaxed">
              Explore a variety of cuisines and dishes from the comfort of your
              home. Whether you&apos;re craving spicy street food, classic
              comfort meals, or healthy gourmet options, we&apos;ve got
              something for every taste bud. Order anytime, anywhere, and enjoy
              doorstep delivery at lightning speed.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row m-12 items-center justify-between p-6 md:p-12 gap-6">
          <div className="text-black p-6 text-center md:text-left max-w-xl">
            <h2 className="text-3xl font-bold mb-4">
              Fast and Reliable Food Delivery Service
            </h2>
            <p className="text-lg leading-relaxed">
              Enjoy your favorite meals delivered straight to your door with
              speed and care. Our food delivery service connects you with
              top-rated local restaurants and ensures every order arrives fresh
              and on time. With real-time tracking and easy payment options,
              satisfying your cravings has never been more convenient.
            </p>
          </div>

          <Image
            src="/food-delivery.png"
            height={500}
            width={500}
            alt="Food Delivery"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
