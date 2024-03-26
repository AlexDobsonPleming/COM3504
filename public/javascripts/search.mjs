"use strict";



const radioButtonIds = [
    {
        id: "datetime",
        comparator: (a, b) => new Date(a.dataset.datetime) - new Date(b.dataset.datetime)
    },
    {
        id: "identification",
        comparator: (a, b) =>
        {
            function IdentificationStatusToInt(idStatus) {
                if (idStatus === "Completed") {
                    return 0;
                } else if (idStatus === "In-Progress") {
                    return 1;
                }
            }

            a = IdentificationStatusToInt(a.dataset.identification)
            b = IdentificationStatusToInt(b.dataset.identification)
            return b - a;
        }

    },
    {
        id: "distance",
        comparator: async (a, b) =>
        {
            const position = await getPosition();

            const extractLatLong = div => ({
                lat: parseFloat(div.dataset.lat),
                long: parseFloat(div.dataset.long)
            });
            a = extractLatLong(a);
            b = extractLatLong(b);

            const degreeToRadian = x => x * Math.PI / 180;
            // radius of the earth (km)
            const RadiusOfTheEarth = 6371;
            const distanceBetweenCoords = (point1, point2) =>
            {
                const dLat = degreeToRadian(point2.lat-point1.lat);
                const dLon = degreeToRadian(point2.long-point1.long);
                const lat1 = degreeToRadian(point1.lat);
                const lat2 = degreeToRadian(point2.lat);

                const preliminary = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
                const secondary = 2 * Math.atan2(Math.sqrt(preliminary), Math.sqrt(1-preliminary));
                return RadiusOfTheEarth * secondary;
            }

            return distanceBetweenCoords(b, position) - distanceBetweenCoords(a, position);
        }
    },
]

const radioButtons = radioButtonIds
    .map(profile => ({
        element: document.getElementById(profile.id),
        comparator: profile.comparator
    }));
radioButtons.forEach(input => input.element.addEventListener('click', inputClicked));

let _position = null;
async function getPosition() {
    if (_position != null) {
        return _position;
    }

    if (navigator.geolocation) {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };
    } else {
        alert("We're afraid that Geolocation is not supported by this browser, and as such this feature is unavailable");
        throw new Error("No access to Geolocation API!");
    }
}

function inputClicked() {
    const inputClickedOn = radioButtons.filter(x =>x.element.checked )[0];


    const searchEntryClassName = "searchEntry";
    const searchEntryResults = Array.from(document.getElementsByClassName(searchEntryClassName));

    const sortedResults = searchEntryResults.sort(inputClickedOn.comparator);

    sortedResults.forEach((div, index) => {
        div.style.order = index;
    });

}