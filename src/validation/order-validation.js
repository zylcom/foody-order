import { z } from "zod";
import { customerDetailsValidation } from "./user-validation";

const orderIdValidation = z
  .string({
    invalid_type_error: "Order id must be a string!",
    required_error: "Order id is required!",
  })
  .min(1, { message: "Order id not allowed to be empty" })
  .uuid({ message: "Order id is invalid!" });

const shippingDetailsValidation = z.object({
  address: z
    .string({
      invalid_type_error: "Shipping address must be a string.",
      required_error: "Shipping address is required!",
    })
    .min(1, { message: "Shipping address not allowed to be empty." }),
  detail: z
    .string({
      invalid_type_error: "Detail home must be a string.",
      required_error: "Detail home is required!",
    })
    .min(1, { message: "Detail home not allowed to be empty." }),
  city: z
    .string({
      invalid_type_error: "City must be a string.",
      required_error: "City is required!",
    })
    .min(1, { message: "City not allowed to be empty." }),
  state: z
    .string({
      invalid_type_error: "State must be a string.",
      required_error: "State is required!",
    })
    .min(1, { message: "State not allowed to be empty." }),
  postalCode: z.coerce
    .string({
      invalid_type_error: "Postal code must be a string.",
      required_error: "Postal code is required!",
    })
    .min(5, { message: "Postal code must be 5 digit." })
    .max(5, {
      message: "Postal code too long. Please enter no more than 5 digit.",
    }),
});

const orderDetailsValidation = z.object({
  shippingDetails: shippingDetailsValidation,
  customerDetails: customerDetailsValidation,
  deliveryDetails: z.object({
    method: z
      .string({
        invalid_type_error: "Delivery method must be a string.",
        required_error: "Delivery method is required!",
      })
      .min(1, { message: "Delivery method not allowed to be empty." }),
    cost: z.coerce
      .number({
        invalid_type_error: "Delivery cost must be a number.",
        required_error: "Delivery cost is required!",
      })
      .gte(0, { message: "Delivery cost can not less than 0." }),
  }),
});

export { orderDetailsValidation, orderIdValidation, shippingDetailsValidation };
