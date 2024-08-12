import axios from "axios";
import {BASE_URL, PACAKGE_ENPOINT} from "../utils/API";
import {decodeJwtToken, getJwtToken} from "./AuthenticationService";

export const createPackageService = async (packageDto: any) => {
    const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
    // const token = getJwtToken();
    const decodedToken = decodeJwtToken(testToken);
    console.log(packageDto);
    const options = {
        method: 'POST',
        url: BASE_URL.concat(PACAKGE_ENPOINT.CREATE_PACKAGE.concat("?userEmail=" + decodedToken?.sub)),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            name: packageDto.name,
            description: packageDto.description,
            isPublished: packageDto.isPublished,
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
    }
}
