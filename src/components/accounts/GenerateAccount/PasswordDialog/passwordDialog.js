import React from 'react';
import PropTypes from 'prop-types';
import { Button, Warning, WarningHeader, WarningText } from 'emerald-js-ui';
import { Field, reduxForm } from 'redux-form';
import TextField from 'elements/Form/TextField';
import { required } from 'lib/validators';
import { Form, Row, styles as formStyles } from 'elements/Form';
import PasswordInput from 'elements/PasswordInput';
import DashboardButton from 'components/common/DashboardButton';
import Advice from './advice';
import styles from './passwordDialog.scss';
import getLoadingIcon from '../getLoadingIcon';

const MIN_PASSWORD_LENGTH = 8;

class PasswordDialog extends React.Component {
  static propTypes = {
    onGenerate: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      passphrase: '',
      passphraseError: null,
      confirmPassword: null,
    };
  }

  handleGenerate = () => {
    const { onGenerate } = this.props;
    const { passphrase, confirmPassword } = this.state;

    // validate passphrase
    if (passphrase.length < MIN_PASSWORD_LENGTH) {
      return this.setState({
        passphraseError: `Minimum ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    if (passphrase !== confirmPassword) {
      return;
    }

    onGenerate(passphrase);
  }

  onPassphraseChange = (newValue) => {
    const passphraseError = (newValue.length === 0 || newValue.length >= MIN_PASSWORD_LENGTH) ?
      null :
      this.state.passphraseError;

    this.setState({
      passphrase: newValue,
      passphraseError,
    });
  }

  onConfirmChange(val) {
    this.setState({
      confirmPassword: val.currentTarget.value,
    });
  }
  passwordMatch(value) {
    const password = this.state.passphrase;
    const confirmPassword = value;
    return confirmPassword === password ? undefined : 'Passwords must match';
  }

  render() {
    const { onDashboard, t, backLabel } = this.props;
    const { passphraseError } = this.state;

    return (
      <Form caption={ t('generate.title') } backButton={ <DashboardButton onClick={ onDashboard } label={backLabel}/> }>
        <Row>
          <div style={ formStyles.left }/>
          <div style={ formStyles.right }>
            <div style={{ width: '100%' }}>
              <div className={ styles.passwordLabel }>Enter a strong password</div>
              <div className={ styles.passwordSubLabel }>
                        This password will be required to confirm all account operations.
              </div>
              <div style={{ marginTop: '30px' }}>
                <PasswordInput
                  onChange={ this.onPassphraseChange }
                  error={ passphraseError }
                />
              </div>
              <div style={{color: '#CF3B3B', fontSize: '14px', marginTop: '5px'}}>If you forget password, you will lose your account with all funds.</div>
            </div>
          </div>
        </Row>
        <Row>
          <div style={formStyles.left} />
          <div style={formStyles.right}>
            <Field
              hintText="Confirm Password"
              name="confirmPassword"
              type="password"
              component={TextField}
              fullWidth={true}
              underlineShow={false}
              onChange={this.onConfirmChange.bind(this)}
              validate={[required, this.passwordMatch.bind(this)]}
            />
          </div>
        </Row>

        <Row>
          <div style={formStyles.left}/>
          <div style={formStyles.right}>
            <Advice
              title="Advice"
              text={ <div>You can use a word or phrase as password. Write it in short text.<br/>
                        Only you know where password is. It is safer than write a password only.
              </div>}
            />
          </div>
        </Row>

        <Row>
          <div style={formStyles.left}/>
          <div style={formStyles.right}>
            <Button
              primary onClick={ this.handleGenerate }
              label="Generate Account"
              icon={ getLoadingIcon(this.props) }
              disabled={ this.props.loading }
            />
          </div>
        </Row>
      </Form>
    );
  }
}

const passwordDialogForm = reduxForm({
  form: 'confirmGeneratePassword',
  fields: ['confirmPassword'],
})(PasswordDialog);

export default passwordDialogForm;

