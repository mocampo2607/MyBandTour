using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppMyBandTour.Models;

namespace WebAppMyBandTour.Controllers
{
    public class EmpresaController : Controller
    {
        public ActionResult Inicio()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            if (Session["AUTENTICADO"] != null)
            {
                if (Session["AUTENTICADO"]?.ToString() == "SI" && Session["ROL"]?.ToString() == "admin")
                {
                    return View();
                }
                else if (Session["AUTENTICADO"]?.ToString() == "SI") {
                    return RedirectToAction("Inicio");
                }
                else
                {
                    return RedirectToAction("Login");
                }
            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Registrarse()
        {
            return View();
        }

        public JsonResult CrearConcierto(string codigo, string banda, string genero, DateTime fecha, TimeSpan hora, string pais, string lugar) { 
            BD_MyBandTourEntities conexion = new BD_MyBandTourEntities();
            ObjectParameter Resultado = new ObjectParameter("Resultado", typeof(int));
            conexion.pr_InsertarConciertoCR(codigo, banda, genero, fecha, hora, pais, lugar, Resultado);

            if ((int)Resultado.Value == 0)
            {
                return Json(new { Estado = "Concierto creado exitosamente" });
            }
            else
            {
                return Json(new { Estado = "Error al crear el concierto." });
            }
        }

        public JsonResult ConsultarConciertos()
        {
            BD_MyBandTourEntities conexion = new BD_MyBandTourEntities();
            var dataSetConciertos = conexion.pr_ConsultarConciertos();
            return Json(new { Lista = dataSetConciertos });
        }

        public JsonResult VerificarUsuario(string usuario, string password)
        {

            BD_MyBandTourEntities conexion = new BD_MyBandTourEntities();
            ObjectParameter Resultado = new ObjectParameter("Resultado", typeof(int));
            var dataSetUsuario = conexion.pr_Autenticar(usuario, password, Resultado);
            if ((int)Resultado.Value == 1) 
            {
                Session["AUTENTICADO"] = "SI";
                if (usuario == "admin") 
                {
                    Session["ROL"] = "admin";
                }
                else
                {
                    Session["ROL"] = "normal";
                }
                return Json(new { Estado = "OK" });
            }
            else
            {
                Session["AUTENTICADO"] = "NO";
                return Json(new { Estado = "FALLIDO" });
            }
        }





    }
}