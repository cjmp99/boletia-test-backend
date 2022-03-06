import path from "path";
import Banner from "../models/Banner.js";
import sizeOf from "image-size";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import {
  devices,
  handleErrors,
  validateDimensionsImage,
} from "../utils/validations.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, "");

export const saveEvent = async (req, res) => {
    const bannerDesktop = req.files.bannerDesktop;
    const bannerTablet = req.files.bannerTablet;
    const bannerMobile = req.files.bannerMobile;

    const dimensionsDesktop =
        req.files?.bannerDesktop?.data && sizeOf(bannerDesktop.data);
    const dimensionsTablet =
        req.files?.bannerTablet?.data && sizeOf(bannerTablet.data);
    const dimensionsMobile =
        req.files?.bannerMobile?.data && sizeOf(bannerMobile.data);

    const { width: widthDesktop } = validateDimensionsImage(
        dimensionsDesktop?.width,
        dimensionsDesktop?.height,
        devices["desktop"]
    );
    const { width: widthTablet } = validateDimensionsImage(
        dimensionsTablet?.width,
        dimensionsTablet?.height,
        devices["tablet"]
    );
    const { width: widthMobile } = validateDimensionsImage(
        dimensionsMobile?.width,
        dimensionsMobile?.height,
        devices["mobile"]
    );

    if (req.body.name === "" || !req.body.name) {
        const { message } = handleErrors("name");
        return res.status(400).json({ message: message });
    } else if (req.body.dateEvent === "" || !req.body.dateEvent) {
        const { message } = handleErrors("dateEvent");
        return res.status(400).json({ message: message });
    } else if (req.body.hourEvent === "" || !req.body.hourEvent) {
        const { message } = handleErrors("hourEvent");
        return res.status(400).json({ message: message });
    } else if (req.body.urlTickets === "" || !req.body.urlTickets) {
        const { message } = handleErrors("urlTickets");
        return res.status(400).json({ message: message });
    } else if (!widthDesktop) {
        const { message } = handleErrors(devices["desktop"]);
        return res.status(400).json({ message: message });
    } else if (!widthTablet) {
        const { message } = handleErrors(devices["tablet"]);
        return res.status(400).json({ message: message });
    } else if (!widthMobile) {
        const { message } = handleErrors(devices["mobile"]);
        return res.status(400).json({ message: message });
    } else {
    try {
        if (bannerDesktop) {
        const filenameDesktop = uuidv4() + path.extname(bannerDesktop.name);
        const filenameTablet = uuidv4() + path.extname(bannerTablet.name);
        const filenameMobile = uuidv4() + path.extname(bannerMobile.name);

        const objEvent = {
            name: req.body.name,
            dateEvent: req.body.dateEvent,
            hourEvent: req.body.hourEvent,
            urlTickets: req.body.urlTickets,
            bannerDesktop: `banners/${filenameDesktop}`,
            bannerTablet: `banners/${filenameTablet}`,
            bannerMobile: `banners/${filenameMobile}`,
        };
        bannerDesktop.mv(`${dir}../../banners/${filenameDesktop}`);
        bannerTablet.mv(`${dir}../../banners/${filenameTablet}`);
        bannerMobile.mv(`${dir}../../banners/${filenameMobile}`);

        const event = new Banner(objEvent);
        const eventSave = await event.save();

        return res.json({
            eventSave,
        });
        } else {
        const { message } = handleErrors(devices["desktop"]);
        return res.status(400).json({ message: message });
        }
    } catch (error) {
        const { message } = handleErrors("internServer");
        return res.status(500).json({ message: message });
    }
    }
};

export const getEvents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const banners = await Banner.paginate({}, { limit, page });
    return res.json({
      data: banners,
    });
  } catch (error) {
    const { message } = handleErrors("internServer");
    return res.status(500).json({ message: message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (req.body.name === "") {
    const { message } = handleErrors("name");
    return res.status(400).json({ message: message });
  } else if (req.body.dateEvent === "") {
    const { message } = handleErrors("dateEvent");
    return res.status(400).json({ message: message });
  } else if (req.body.hourEvent === "") {
    const { message } = handleErrors("hourEvent");
    return res.status(400).json({ message: message });
  } else if (req.body.urlTickets === "") {
    const { message } = handleErrors("urlTickets");
    return res.status(400).json({ message: message });
  } else {
    try {
      const objEvent = {
        name: req.body.name,
        dateEvent: req.body.dateEvent,
        hourEvent: req.body.hourEvent,
        urlTickets: req.body.urlTickets,
      };
      const banner = await Banner.findByIdAndUpdate(
        id,
        {
          name: objEvent.name,
          dateEvent: objEvent.dateEvent,
          hourEvent: objEvent.hourEvent,
          urlTickets: objEvent.urlTickets,
        },
        { new: true }
      );

      return res.json({
        banner,
      });
    } catch (error) {
      console.log(error);
      const { message } = handleErrors("internServer");
      return res.status(500).json({ message: message });
    }
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findByIdAndDelete(id);

  if (banner) {
    let existImageDesktop = await fs.pathExists(
      path.resolve(`src/${banner.bannerDesktop}`)
    );
    let existImageTablet = await fs.pathExists(
      path.resolve(`src/${banner.bannerTablet}`)
    );
    let existImageMobile = await fs.pathExists(
      path.resolve(`src/${banner.bannerMobile}`)
    );

    if (existImageDesktop && existImageTablet && existImageMobile) {
      await fs.unlink(path.resolve(`src/${banner.bannerDesktop}`));
      await fs.unlink(path.resolve(`src/${banner.bannerTablet}`));
      await fs.unlink(path.resolve(`src/${banner.bannerMobile}`));
      const { message } = handleErrors("deleteEventSuccess");
      return res.json({ message: message });
    } else {
      const { message } = handleErrors("deleteEventFail");
      return res.json({ message: message });
    }
  } else {
    const { message } = handleErrors("deleteEventNoExists");
    return res.json({ message: message });
  }
};

export const updateImageDesktop = async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);

  if (banner) {
    let existImageDesktop = await fs.pathExists(
      path.resolve(`src/${banner.bannerDesktop}`)
    );

      if(existImageDesktop) await fs.unlink(path.resolve(`src/${banner.bannerDesktop}`));

      const bannerDesktop = req.files.bannerDesktop;

      const dimensionsDesktop =
        req.files?.bannerDesktop?.data && sizeOf(bannerDesktop.data);
      const { width, height } = validateDimensionsImage(
        dimensionsDesktop?.width,
        dimensionsDesktop?.height,
        devices["desktop"]
      );
      if (!width && !height) {
        const { message } = handleErrors(devices["desktop"]);
        return res.status(400).json({ message: message });
      } else {
        try {
          if (bannerDesktop) {
            const filenameDesktop = uuidv4() + path.extname(bannerDesktop.name);

            bannerDesktop.mv(`${dir}../../banners/${filenameDesktop}`);
            const banner = await Banner.findByIdAndUpdate(
              id,
              {
                bannerDesktop: `banners/${filenameDesktop}`,
              },
              { new: true }
            );
            return res.json({
              banner,
            });
          } else {
            const { message } = handleErrors(devices["desktop"]);
            return res.status(400).json({ message: message });
          }
        } catch (error) {
          console.log(error);
          const { message } = handleErrors("internServer");
          return res.status(500).json({ message: message });
        }
      }
  } else {
    const { message } = handleErrors("deleteEventNoExists");
    return res.json({ message: message });
  }
};

export const updateImageTablet = async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);

  if (banner) {
    let existImageTablet = await fs.pathExists(
      path.resolve(`src/${banner.bannerTablet}`)
    );

    if(existImageTablet) await fs.unlink(path.resolve(`src/${banner.bannerTablet}`));

    const bannerTablet = req.files.bannerTablet;

    const dimensionsTablet =
      req.files?.bannerTablet?.data && sizeOf(bannerTablet.data);
    const { width, height } = validateDimensionsImage(
      dimensionsTablet?.width,
      dimensionsTablet?.height,
      devices["tablet"]
    );
    if (!width && !height) {
      const { message } = handleErrors(devices["tablet"]);
      return res.status(400).json({ message: message });
    } else {
      try {
        if (bannerTablet) {
          const filenameTablet = uuidv4() + path.extname(bannerTablet.name);

          bannerTablet.mv(`${dir}../../banners/${filenameTablet}`);
          const banner = await Banner.findByIdAndUpdate(
            id,
            {
              bannerTablet: `banners/${filenameTablet}`,
            },
            { new: true }
          );
          return res.json({
            banner,
          });
        } else {
          const { message } = handleErrors(devices["tablet"]);
          return res.status(400).json({ message: message });
        }
      } catch (error) {
        console.log(error);
        const { message } = handleErrors("internServer");
        return res.status(500).json({ message: message });
      }
    }
  } else {
    const { message } = handleErrors("deleteEventNoExists");
    return res.json({ message: message });
  }
};

export const updateImageMobile = async (req, res) => {
    const { id } = req.params;
  
    const banner = await Banner.findById(id);
  
    if (banner) {
      let existImageMobile = await fs.pathExists(
        path.resolve(`src/${banner.bannerMobile}`)
      );
  
      if(existImageMobile) await fs.unlink(path.resolve(`src/${banner.bannerMobile}`));
  
      const bannerMobile = req.files.bannerMobile;
  
      const dimensionsMobile
       =
        req.files?.bannerMobile?.data && sizeOf(bannerMobile.data);
      const { width, height } = validateDimensionsImage(
        dimensionsMobile
        ?.width,
        dimensionsMobile
        ?.height,
        devices["mobile"]
      );
      if (!width && !height) {
        const { message } = handleErrors(devices["mobile"]);
        return res.status(400).json({ message: message });
      } else {
        try {
          if (bannerMobile) {
            const filenameMobile = uuidv4() + path.extname(bannerMobile.name);
  
            bannerMobile.mv(`${dir}../../banners/${filenameMobile}`);
            const banner = await Banner.findByIdAndUpdate(
              id,
              {
                bannerMobile: `banners/${filenameMobile}`,
              },
              { new: true }
            );
            return res.json({
              banner,
            });
          } else {
            const { message } = handleErrors(devices["mobile"]);
            return res.status(400).json({ message: message });
          }
        } catch (error) {
          console.log(error);
          const { message } = handleErrors("internServer");
          return res.status(500).json({ message: message });
        }
      }
    } else {
      const { message } = handleErrors("deleteEventNoExists");
      return res.json({ message: message });
    }
  };
