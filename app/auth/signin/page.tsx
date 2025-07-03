'use client';
import * as React from 'react';
import Link from '@mui/material/Link';
import {SignInPage} from '@toolpad/core/SignInPage';
import {providerMap} from '../../../auth';
import signIn from './actions';

function ForgotPasswordLink() {
    return (
        <span>
      <Link fontSize="0.75rem" href="/auth/forgot-password">
        Wachtwoord vergeten?
      </Link>
    </span>
    );
}

function SignUpLink() {
    return (
        <span style={{fontSize: '0.8rem'}}>
        Nog geen account? <Link href="/auth/signup">Registreren</Link>
    </span>
    );
}

export default function SignIn() {
    return (
        <SignInPage
            providers={providerMap}
            signIn={signIn}
            slots={{
                forgotPasswordLink: ForgotPasswordLink,
                signUpLink: SignUpLink,
            }}
        />
    );
}
