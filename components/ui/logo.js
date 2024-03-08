import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ isMobile }) => {
  return (
    <Link href={'/'}>
      <div className="flex  items-center">
        <div className="flex justify-center items-center">
          {/* <Image
            src="/logo.png"
            alt="Logo"
            width={30}
            height={34}
            className="sm:w-[30px] w-[21px] h-[25px] sm:h-[30px] mt-1"
          /> */}
          <h1
            className={
              "intro-title inline-block text-transparent px-0 lg:px-0 bg-clip-text py-4 text-3xl font-bold bg-gradient-to-r from-[#108dc7] to-[#ef8e38] font-squarePeg"
            }
          >
            DocTalker
          </h1>
        </div>
        {!isMobile ? (
          <h1 className="shadows  text-primary text-[32px] sm:text-[35px]">
            DocTalker
          </h1>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
