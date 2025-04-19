using ContactsSystem.Core.Entities;
using ContactsSystem.Core.Interfaces.Iservice;
using ContactsSystem.Hubs;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ContactsSystem.Controllers
{
    public class ContactsController( IContactService contactService, IValidator<Contact> validator) : Controller
    {
        private readonly IContactService _contactService = contactService;
        private readonly IValidator<Contact> _validator = validator;

        [Authorize]
        public async Task<IActionResult> Index(int page = 1, string search = "")
        {
            var pageSize = 5;
            var model = await _contactService.GetPaginatedContacts(page, pageSize, search);

            if (model.Count == 0 && model.TotalPages > 0)
            {
                return RedirectToAction(nameof(Index), new
                {
                    page = Math.Max(1, model.TotalPages),
                    search
                });
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Contact contact)
        {
            var validationResult = await _validator.ValidateAsync(contact);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

                return BadRequest(errors);
            }

            await _contactService.AddContact(contact);
            return Ok();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Contact contact)
        {

            if (id != contact.Id) return NotFound();
            contact.Phone = contact.Phone.Trim();
            var validationResult = await _validator.ValidateAsync(contact);
            if (!validationResult.IsValid)
            {
                
                var errors = validationResult.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

                return BadRequest(errors);
            }

            try
            {
                await _contactService.UpdateContact(contact);
                return Ok();
            }
            catch (Exception)
            {
                if (!await _contactService.ContactExists(contact.Id))
                    return NotFound();
                throw;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _contactService.DeleteContact(id);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }
    }
}
