import PropTypes from "prop-types";

/** Renders category-specific spec lines for catalog and product detail. */
export function ProductSpecs({ product }) {
  const specs = product?.specifications;
  if (!specs || !product?.category) return null;

  switch (product.category) {
    case "CPU":
      return (
        <>
          <p>
            {specs.cores} Cores, {specs.threads} Threads
          </p>
          <p>Base: {specs.baseSpeed}</p>
        </>
      );
    case "GPU":
      return (
        <>
          <p>
            {specs.memory} {specs.memoryType}
          </p>
          <p>Clock: {specs.coreClock}</p>
        </>
      );
    case "RAM":
      return (
        <>
          <p>
            {specs.capacity} {specs.type}
          </p>
          <p>
            {specs.speed} {specs.timing}
          </p>
        </>
      );
    case "Storage":
      return (
        <>
          <p>
            {specs.type} {specs.capacity}
          </p>
          <p>Read: {specs.readSpeed}</p>
        </>
      );
    case "Motherboard":
      return (
        <>
          <p>
            {specs.formFactor}, {specs.socket}
          </p>
          <p>{specs.chipset}</p>
        </>
      );
    case "PSU":
      return (
        <>
          <p>
            {specs.wattage}, {specs.efficiency}
          </p>
          <p>{specs.modular}</p>
        </>
      );
    case "Case":
      return (
        <>
          <p>
            {specs.type}, {specs.material}
          </p>
          <p>GPU: up to {specs.maxGPULength}</p>
        </>
      );
    default:
      return null;
  }
}

ProductSpecs.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string,
    specifications: PropTypes.object,
  }),
};
