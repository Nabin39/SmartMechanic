/**
 * Firebase Storage — placeholder structure for vehicle issue photos.
 *
 * Full upload flow: getStorage() → ref(`bookings/${bookingId}/issue.jpg`) → uploadBytes / uploadString.
 * Requires Firebase Storage rules and optional expo-file-system to read local URIs from image picker.
 *
 * For this academic build, we keep `photoPath` / `photoUrl` on the booking document:
 * - `photoPath`: local device URI from expo-image-picker (works offline in UI)
 * - `photoUrl`: reserved for future Storage download URL after upload
 */
export async function uploadBookingPhotoPlaceholder(
  _localUri: string,
  _bookingId: string
): Promise<{ remoteUrl: string | null; error?: string }> {
  return {
    remoteUrl: null,
    error:
      'Storage upload not configured — add Firebase Storage and uncomment upload in bookingService.',
  };
}
