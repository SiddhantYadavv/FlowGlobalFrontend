import api from "./api";

export async function uploadCheckIn(checkIn) {
    try {
        const formData = new FormData();

        formData.append("image", {
            uri: checkIn.photo,
            type: "image/jpeg",
            name: `checkin-${checkIn.id}.jpg`,
        });

        formData.append("latitude", String(checkIn.latitude));

        formData.append("longitude", String(checkIn.longitude));

        formData.append("notes", checkIn.notes ?? "");

        formData.append("checkedInAt", checkIn.createdAt);
        console.log("Base URL:", api.defaults.baseURL);

        const response = await api.post(
            "/checkins",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log("UPLOAD ERROR");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        throw error;
    }
}