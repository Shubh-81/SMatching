import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../scenes/navbar";
import UserWidget from "../../scenes/widgets/UserWidget";
import AdvertWidget from "../../scenes/widgets/AdvertWidget";
import ChoicesWidget from "../../scenes/widgets/ChoicesWidget";
import Share from '../../scenes/widgets/Share'
import TopHits from '../../scenes/widgets/TopHits'


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Share />
          <Box m="2rem 0" />
          {isNonMobileScreens&&<UserWidget userId={_id} picturePath={picturePath} />}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <ChoicesWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            <AdvertWidget />
            <Box m="2rem 0" />
            <TopHits />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
