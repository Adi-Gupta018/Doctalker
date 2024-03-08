import Logo from "../ui/logo";
import handleTourStart from "../tour";
const Header = () => {
  return (
    <>
      <div className="container hidden bg-white w-full px-5  h-[78px] sm:flex justify-between items-center border shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] rounded-[30px] border-solid border-[rgba(0,0,0,0.17)] mx-auto">
        <h1
          className={
            "intro-title inline-block text-transparent px-5 lg:px-0 bg-clip-text py-4 text-3xl font-bold bg-gradient-to-r from-[#108dc7] to-[#ef8e38] font-squarePeg"
          }
        >
          DocTalker
        </h1>
        <div className="sm:flex gap-4 items-center">
          <button
            id="tourButton"
            onClick={handleTourStart}
            className="text-white bg-[#ef8e38] hover:bg-[#ef7b38] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 me-2 mb-2  tour-button"
          >
            Tour
          </button>
        </div>
      </div>

      <div className="sm:hidden bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-b-[0.5px] h-[54px] flex justify-between items-center px-6 border-b-white border-solid">
        <Logo isMobile={true} />
        <div className="flex justify-center items-baseline">
        <button className="text-white bg-[#ef8e38] py-1 px-[22px] text-center text-lg font-normal  rounded-lg border-solid border-primary "
        onClick={handleTourStart}>
            Tour
          </button>
        </div>
      </div>
     
    </>
  );
};

export default Header;
