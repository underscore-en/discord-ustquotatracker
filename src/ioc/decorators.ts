import getDecorators from "inversify-inject-decorators";
import { container } from "./container";

export const { lazyInject } = getDecorators(container);
