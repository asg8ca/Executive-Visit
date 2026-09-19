// to switch between brands, look for
// bosch
// pro
// diy or
// dremel
// in the imports and replace with the desired brand
// start with foundations
@use 'pkg:@bosch/frontend.kit-npm/styles/frontend-kit-foundations.css';
@use 'pkg:@bosch/frontend.kit-npm/styles/frontend-kit-icons.css';

// continue with semantic tokens, here lives the brand
@use 'pkg:@bosch/frontend.kit-npm/bosch/semantic/index.css';
@use 'pkg:@bosch/frontend.kit-npm/bosch/components/components.css';

// next configure font files
@use 'pkg:@bosch/frontend.kit-npm/bosch/fonts.scss' with (
  $font-base-path: ''
);

// to get the correct colors we need to import the backgrounds and gradation we need
@use 'pkg:@bosch/frontend.kit-npm/bosch/gradations/gradations.css';
@use 'pkg:@bosch/frontend.kit-npm/bosch/backgrounds/light-mode-primary-schemes.css';
@use 'pkg:@bosch/frontend.kit-npm/bosch/backgrounds/light-mode-primary-nested-schemes.css';
@use 'pkg:@bosch/frontend.kit-npm/bosch/backgrounds/light-mode-secondary-schemes.css';

// add desired components
// importing components CSS all together in one place is not required
// you can import respective CSS directly in your React/Angular/Vue/etc component
@use 'pkg:@bosch/frontend.kit-npm/atoms/text.css';
@use 'pkg:@bosch/frontend.kit-npm/atoms/button.css';
@use 'pkg:@bosch/frontend.kit-npm/atoms/link.css';
@use 'pkg:@bosch/frontend.kit-npm/atoms/checkbox.css';
@use 'pkg:@bosch/frontend.kit-npm/atoms/chip.css';

.your-custom-component {
  background: var(--signal-success-major__enabled__default__fill);
  color: var(--signal-success-major__enabled__default__front);
  // background: var(
  //   --nested-major__enabled__default__fill,
  //   var(--signal-success-major__enabled__default__fill)
  // );
  // color: var(
  //   --nested-major__enabled__default__front,
  //   var(--signal-success-major__enabled__default__front)
  // );
  padding: 1rem;
}