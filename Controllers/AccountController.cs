using ContactsSystem.Core.Interfaces.Iservice;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ContactsSystem.Models;

namespace ContactsSystem.Controllers
{
    public class AccountController(IAuthService authService) : Controller
    {
        private readonly IAuthService _authService = authService;

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                if (_authService.ValidateCredentials(model.UserName, model.Password))
                {
                    await _authService.SignInAsync(HttpContext, model.UserName, model.RememberMe);

                    return Json(new { redirectUrl = returnUrl ?? Url.Action("Index", "Contacts") });
                }

                ModelState.AddModelError(string.Empty, "Invalid login attempt");
            }

            var errors = ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
            );

            return BadRequest(new { error = "Invalid credentials", errors });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("HardcodedAuth");
            return RedirectToAction(nameof(Login));
        }
    }
}
