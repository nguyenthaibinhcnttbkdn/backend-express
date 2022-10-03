import { SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver } from "graphql";
export class IsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const [_, {}, { user }] = args;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}
