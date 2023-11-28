import { prisma } from "@/lib/prisma";
import Joi from "joi";

const postSchema = Joi.object({
  description: Joi.string().optional(),
  preferredName: Joi.string().optional(),
})
  .min(1)
  .messages({
    "any.min": "provide at least one value",
  });

export async function GET(request: Request) {
  const res = await prisma.profile.findMany();
  return Response.json({
    request: request.method,
    data: res,
  });
}

export const POST = async (req: Request) => {
  const data = await req.formData();
  return Response.json({
    method: req.method,
    data: Object.fromEntries(data.entries()),
  });
};
