import foundation from "./themes/foundation.scss";
import features from "./vendor/polish/v2ex-effect.scss";
import decoration from "./themes/decoration.scss";
import replies from "./vendor/rep/content.scss";
import palettes from "./themes/index.scss";
import native from "./themes/native.scss";
import integration from "./styles.css";

export function themeStyles(theme) {
  return theme === "native"
    ? [native, features, replies, integration].join("\n")
    : [foundation, features, decoration, replies, palettes, integration].join("\n");
}
