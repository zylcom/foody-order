import { z } from "zod";

const registerUserValidation = z
  .object({
    name: z
      .string({
        invalid_type_error: "Name must be a string.",
        required_error: "Name is required!",
      })
      .max(100, {
        message: "Your name is too long. Please enter no more than 100.",
      })
      .min(1, { message: "Name is not allowed to be empty!" }),
    username: z
      .string({
        invalid_type_error: "Username must be a string.",

        required_error: "Username is required!",
      })
      .max(100, {
        message: "Your username is too long. Please enter no more than 100.",
      })
      .min(1, { message: "Username is not allowed to be empty!" }),
    passwordForm: z
      .object({
        password: z
          .string({
            invalid_type_error: "Password must be a string.",
            required_error: "Password is required!",
          })
          .min(8, { message: "Your password must be at least 8 characters" })
          .min(1, { message: "Password is not allowed to be empty!" }),
        confirm: z.string({
          invalid_type_error: "Password confirm must be a string.",
          required_error: "Password confirm is required!",
        }),
      })
      .required()
      .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match!",
        path: ["confirm"],
      }),
    phonenumberForm: z.object({
      number: z
        .string({
          invalid_type_error: "Phone number must be a string.",
          required_error: "Phone number is required!",
        })
        .min(10, {
          message: "Your phone number must be at least 10 characters.",
        })
        .max(24, {
          message:
            "Your phone number is too long. Please enter no more than 25 characters.",
        }),
      countryCode: z
        .string({
          invalid_type_error: "Phone number must be a string.",
          required_error: "Country code is required!",
        })
        .min(1, { message: "Country code is not allowed to be empty!" })
        .max(2, {
          message:
            "Country code is too long. Country codes are two-letter, defined in ISO 3166-1 alpha-2.",
        })
        .default("ID"),
    }),
  })
  .required();

const loginUserValidation = z
  .object({
    username: z
      .string({ required_error: "Username is required!" })
      .min(1, { message: "Username is not allowed to be empty!" }),
    password: z
      .string({ required_error: "Password is required!" })
      .min(1, { message: "Password is not allowed to be empty!" }),
  })
  .required();

const customerDetailsValidation = registerUserValidation.omit({
  passwordForm: true,
  username: true,
});

export {
  customerDetailsValidation,
  registerUserValidation,
  loginUserValidation,
};
