import { Select, TextField } from '@folio/stripes/components';
import {
  customPropertyTypes,
  invalidNumberValidator,
  requiredValidator,
} from '@folio/stripes-erm-components';

const { DECIMAL, NUMBER, SELECT } = customPropertyTypes;

export default termDefinition => {
  const props = {
    validate: requiredValidator
  };

  const type = termDefinition?.type;

  if (type === NUMBER || type === DECIMAL) {
    props.component = TextField;
    props.type = 'number';
    props.validate = invalidNumberValidator;
  } else if (type === SELECT) {
    props.component = Select;
    props.dataOptions = termDefinition.category.values.map(rdv => ({ label: rdv.label, value: rdv.id }));
    props.placeholder = ' ';
  } else {
    props.component = TextField;
  }

  return props;
};
