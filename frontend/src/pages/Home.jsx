import Header from "../componenets/Header";
import TopDoctors from "../componenets/TopDoctors";
import Banner from "../componenets/Banner";
import SpecialitySlider from "../componenets/SpecialitySlider";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialitySlider />

      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
