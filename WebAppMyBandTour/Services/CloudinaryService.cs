using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Configuration;
using System.Web;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService()
    {
        var cloudinaryUrl = ConfigurationManager.AppSettings["CloudinaryUrl"];
        // cloudinary://API_KEY:API_SECRET@CLOUD_NAME

        // Extraer los valores
        var parts = cloudinaryUrl.Replace("cloudinary://", "").Split('@');
        var keySecret = parts[0].Split(':');

        var account = new Account(
            parts[1],       // Cloud Name
            keySecret[0],   // API Key
            keySecret[1]    // API Secret
        );

        _cloudinary = new Cloudinary(account);
    }

    public string SubirImagen(HttpPostedFileBase archivo, string publicId = null)
    {
        if (archivo == null || archivo.ContentLength == 0)
            return null;

        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(archivo.FileName, archivo.InputStream),
            PublicId = publicId,
            Folder = "conciertos"
        };

        var uploadResult = _cloudinary.Upload(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }
}