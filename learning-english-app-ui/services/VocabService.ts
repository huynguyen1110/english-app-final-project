import axios from "axios";
import {PACAKGE_ENPOINT} from "../utils/API";
import {decodeJwtToken, getJwtToken} from "./AuthenticationService";

export const createPackageService = async (packageDto: any) => {
    const token = getJwtToken();
    const decodedToken = decodeJwtToken(token);
    const options = {
        method: 'POST',
        url: PACAKGE_ENPOINT.CREATE_PACKAGE.concat("?userEmail=" + decodedToken?.sub),
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
