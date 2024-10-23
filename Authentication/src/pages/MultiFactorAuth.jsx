import { useState } from "react";
import auth from "../firebase/firebase.config"; // Firebase config
import {
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  //   RecaptchaVerifier,
  getMultiFactorResolver,
} from "firebase/auth";

const MultiFactorAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState(null);
  const [resolver, setResolver] = useState(null);
  const [verificationId, setVerificationId] = useState("");

  // Set up the reCAPTCHA verifier
  //   const setupRecaptcha = () => {
  //     if (!window.recaptchaVerifier) {
  //       window.recaptchaVerifier = new RecaptchaVerifier(
  //         "recaptcha-container", // Make sure this matches the id of the recaptcha div
  //         {
  //           size: "invisible", // 'invisible' recaptcha or 'normal'
  //           callback: (response) => {
  //             console.log("reCAPTCHA solved", response);
  //           },
  //         },
  //         auth // Ensure this is the Firebase auth instance
  //       );
  //     }
  //   };

  // Sign in the user with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);

      // Check if multi-factor authentication is required
      if (auth.currentUser.multiFactor.enrolledFactors.length === 0) {
        console.log(
          "No MultiFactorAuth set up. Enrolling the phone number as second factor."
        );
        await handleEnrollPhoneNumber();
      }
    } catch (error) {
      if (error.code === "auth/multi-factor-auth-required") {
        // If MultiFactorAuth is required
        const multiFactorResolver = getMultiFactorResolver(auth, error);
        setResolver(multiFactorResolver);
      } else {
        console.error(error);
      }
    }
  };

  // Enroll user's phone number as a second factor
  const handleEnrollPhoneNumber = async () => {
    try {
      //   setupRecaptcha(); // Set up reCAPTCHA
      const session = await auth.currentUser.multiFactor.getSession();
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        {
          phoneNumber,
          session,
        },
        window.recaptchaVerifier
      );
      setVerificationId(verificationId);
      console.log("Verification ID:", verificationId);
    } catch (error) {
      console.error(error);
    }
  };

  // Verify the second factor using the verification code
  const handleVerifyCode = async () => {
    try {
      const phoneCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const multiFactorAssertion =
        PhoneAuthProvider.multiFactor.assertion(phoneCredential);

      if (resolver) {
        await resolver.resolveSignIn(multiFactorAssertion);
        console.log("Multi-factor authentication successful");
      } else {
        await auth.currentUser.multiFactor.enroll(multiFactorAssertion);
        console.log("Phone number enrolled as second factor");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Multi-Factor Authentication</h2>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>

      {/* Enroll Phone Number */}
      {user && (
        <div>
          <h3>Enroll Phone Number for MultiFactorAuth</h3>
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handleEnrollPhoneNumber}>Enroll Phone</button>
        </div>
      )}

      {/* Verification Code Input */}
      {verificationId && (
        <div>
          <h3>Enter Verification Code</h3>
          <input
            type="text"
            placeholder="Verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
      )}

      {/* reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default MultiFactorAuth;
