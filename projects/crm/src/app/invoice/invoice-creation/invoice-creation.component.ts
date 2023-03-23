import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-creation',
  template: `
    <div class="bg-light p-5 rounded">
      <h1>Créer une nouvelle facture</h1>
      <p class="alert bg-info text-white">
        Remplissez les informations de la facture afin de la retrouver dans
        votre liste plus tard !
      </p>

      <form [formGroup]="invoiceForm" (submit)="onSubmit()">
        <div class="row">
          <div class="col">
            <label for="description">Description</label>
            <input
              formControlName="description"
              [class.is-invalid]="description.touched && description.invalid"
              type="text"
              id="description"
              name="description"
              placeholder="Description de la facture"
              class="form-control mb-3"
            />
            <p class="invalid-feedback">
              La description est obligatoire et doit faire au moins 5 caractères
              !
            </p>
          </div>
          <div class="col">
            <label for="customer_name">Client</label>
            <input
              formControlName="customer_name"
              [class.is-invalid]="customerName.touched && customerName.invalid"
              type="text"
              id="customer_name"
              name="customer_name"
              placeholder="Nom du client / la société"
              class="form-control mb-3"
            />
            <p class="invalid-feedback">
              Le client est obligatoire et doit faire au moins 5 caractères !
            </p>
          </div>
          <div class="col">
            <label for="status">Statut</label>
            <select
              formControlName="status"
              name="status"
              id="status"
              class="form-control mb-3"
            >
              <option value="SENT">Envoyée</option>
              <option value="PAID">Payée</option>
              <option value="CANCELED">Annulée</option>
            </select>
          </div>
        </div>

        <hr />

        <h3>Détails de la facture</h3>
        <div class="alert bg-warning text-white" *ngIf="details.length === 0">
          <p>Vous devez ajouter des détails à votre facture</p>
          <button class="btn btn-sm btn-outline-light" (click)="onAddDetails()">
            + Ajouter ma première ligne
          </button>
        </div>
        <section formArrayName="details">
          <div
            class="detail-row"
            *ngFor="let group of details.controls; let i = index"
            [formGroup]="group"
          >
            <div class="row mb-3">
              <div class="col-7">
                <input
                  formControlName="description"
                  [class.is-invalid]="
                    group.controls.description.touched &&
                    group.controls.description.invalid
                  "
                  name="description_{{ i }}"
                  id="description_{{ i }}"
                  type="text"
                  placeholder="Description"
                  class="form-control"
                />
                <p class="invalid-feedback">
                  La description est obligatoire et doit faire au moins 5
                  caractères !
                </p>
              </div>
              <div class="col-2">
                <input
                  formControlName="amount"
                  [class.is-invalid]="
                    group.controls.amount.touched &&
                    group.controls.amount.invalid
                  "
                  name="amount_{{ i }}"
                  id="amount_{{ i }}"
                  type="number"
                  placeholder="Montant"
                  class="form-control"
                />
                <p class="invalid-feedback">Le montant est obligatoire</p>
              </div>
              <div class="col-2">
                <input
                  formControlName="quantity"
                  [class.is-invalid]="
                    group.controls.quantity.touched &&
                    group.controls.quantity.invalid
                  "
                  type="number"
                  placeholder="Quantité"
                  class="form-control"
                />
                <p class="invalid-feedback">La quantité est obligatoire</p>
              </div>
              <div class="col-1">
                <button
                  type="button"
                  class="btn w-auto d-block btn-sm btn-danger"
                  (click)="onRemoveDetails(i)"
                >
                  X
                </button>
              </div>
            </div>
          </div>
          <button
            *ngIf="details.length > 0"
            class="btn btn-primary btn-sm"
            type="button"
            (click)="onAddDetails()"
          >
            + Ajouter une ligne
          </button>
        </section>

        <hr />

        <div class="row">
          <div class="col-6 text-end">Total HT :</div>
          <div class="col" id="total_ht">{{ total }} CHF</div>
        </div>

        <div class="row">
          <div class="col-6 text-end">Total TVA :</div>
          <div class="col" id="total_tva">{{ totalTVA }} CHF</div>
        </div>
        <div class="row fw-bold">
          <div class="col-6 text-end">Total TTC :</div>
          <div class="col" id="total_ttc">{{ totalTTC }} CHF</div>
        </div>

        <button class="mt-3 w-sm-auto btn btn-success" id="submit">
          Enregistrer
        </button>
      </form>
    </div>
  `,
  styles: [],
})
export class InvoiceCreationComponent implements OnInit {
  invoiceForm = this.fb.group({
    customer_name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    status: [''],
    details: this.fb.array<
      FormGroup<{
        description: FormControl;
        amount: FormControl;
        quantity: FormControl;
      }>
    >([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get customerName() {
    return this.invoiceForm.controls.customer_name;
  }

  get description() {
    return this.invoiceForm.controls.description;
  }

  get status() {
    return this.invoiceForm.controls.status;
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

  get total(){
    return this.details.value.reduce((itemTotal: number, item) => {
      return itemTotal + (item.amount * item.quantity);
    }, 0) 
  }

  get totalTVA(){
    return this.total * 0.2;
  }

  get totalTTC(){
    return this.total + this.totalTVA;
  }

  onAddDetails() {
    this.details.push(
      this.fb.group({
        description: ['', [Validators.required, Validators.minLength(5)]],
        amount: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  onRemoveDetails(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    console.log(this.invoiceForm.value);
  }
}
