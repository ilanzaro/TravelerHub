import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LogoSVG from "../assets/svg/google-icon-logo-svg.svg";

/* =======================================================
   WEB COMPONENT (Google Identity Services)
======================================================= */

export function GoogleSigninButtonWeb() {
  const signInGoogleVerify = useAuthStore((state) => state.signInGoogleVerify);
  return (
    <TouchableOpacity
      style={[styles.button, styles.googleButton]}
      onPress={() => signInGoogleVerify()}
    >
      <View style={styles.googleButtonContent}>
        <LogoSVG width={24} height={24} />{" "}
        <Text style={[styles.buttonText, styles.googleButtonText]}>
          Continue with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* =======================================================
   NATIVE COMPONENT (YOUR LOGIC, UNCHANGED)
======================================================= */

function GoogleSigninButtonNative() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
  });

  const onPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken } = await GoogleSignin.getTokens();
        console.log("GoogleSigninButtonNative", idToken);
        console.log(
          "GoogleSigninButtonNative",
          JSON.stringify(response, null, 2)
        );
        //const { idToken } = response.data;
        if (!idToken) throw new Error("No idToken returned from Google Signin");
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken || "",
        });
        console.log("supabase signInWithIdToken", data, error);
      } else {
        // cancelled
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={onPress}
    />
  );
}

export default function GoogleSignIn() {
  return Platform.OS === "web" ? (
    <GoogleSigninButtonWeb />
  ) : (
    <GoogleSigninButtonNative />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: { backgroundColor: "transparent", borderWidth: 2 },
  buttonText: { fontSize: 18, fontWeight: "600" },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleButtonText: {
    color: "#3c4043",
    fontWeight: "500",
  },
});
