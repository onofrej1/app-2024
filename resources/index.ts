import { user } from "@/resources/user";
import { Resource } from "@/resources//resources.types";
import { post } from "@/resources/post";
import { category } from "@/resources/category";

const resources: Resource[] = [
  user,
  post,
  category
];
export { resources };