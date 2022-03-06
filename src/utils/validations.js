export const devices = {
    desktop: "desktop",
    tablet: "tablet",
    mobile: "mobile",
};

export const validateDimensionsImage = (width, height, type) => {
    const dimensionsWidth =
        devices[type] === "desktop"
        ? { 2340: true }
        : devices[type] === "tablet"
        ? { 1440: true }
        : devices[type] === "mobile"
        ? { 1920: true }
        : {};
    const dimensionsHeight =
        devices[type] === "desktop"
        ? { 700: true }
        : devices[type] === "tablet"
        ? { 1080: true }
        : devices[type] === "mobile"
        ? { 1080: true }
        : {};

    const validateWidth = dimensionsWidth[width] || false;
    const validateHeight = dimensionsHeight[height] || false;

    return {
        width: validateWidth,
        height: validateHeight,
    };
};

export const handleErrors = (type) => {
    const responses = {
        desktop: "The desktop image must have a resolution of 2340 x 700 pixels",
        tablet: "The tablet image must have a resolution of 1440 x 1080 pixels",
        mobile: "The mobile image must have a resolution of 1920 x 1080 pixels",
        name: "Event name cannot be empty",
        dateEvent: "Add a valid date for the start of the event",
        hourEvent: "Add a valid time for the start of the event",
        urlTickets: "Add a link where to buy tickets for this event, example: https://www.ticketmundo.com/",
        internServer: "There was an internal problem on the server.",
        deleteEventSuccess: "The event has been deleted successfully",
        deleteEventFail: "The images do not exist in the directory, the saved data will still be erased",
        deleteEventNoExists: "The images do not exist in the directory",
    };
    const message = responses[type]
    return { message }
};
