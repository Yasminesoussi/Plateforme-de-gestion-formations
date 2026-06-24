import { Formation } from './../../models/Formation';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from './../../services/payment.service';
import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/Payment';
import { Apprenant } from 'src/app/models/Apprenant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payement-apprenant',
  templateUrl: './payement-apprenant.component.html',
  styleUrls: ['./payement-apprenant.component.css']
})
export class PayementApprenantComponent implements OnInit {
  loading: boolean = true
  payment!: any
  id!: any
  sommeTranches: number = 0
  payments: Payment[] = []
  formations: any[] = []
  newTrancheAmount: number = 0
  selectedFormationId: string = ''
  errorMessage: string = ''
  showError: boolean = false
  messageInfo: string = ''
  messageInfo1: string = ''
  apprenant: Apprenant[] = []

  paymentData = {
    montant_tranche: 0
  }
  constructor(private payService: PaymentService, private route: ActivatedRoute) {}



  ngOnInit (): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getPayementsForApprenant(this.id)
    this.getAllPayments()
    this.getAllFormation()
  }

  getTotalTranches (p: any): number {
    if (p.tranches && p.tranches.length > 0) {
      return p.tranches.reduce(
        (acc: number, t: any) => acc + t.montant_tranche,
        0
      )
    }
    return 0
  }

  getAllFormation () {
    this.payService.getAllFormation().subscribe({
      next: data => {
        this.formations = data
      },
      error: err => {
        console.log(err.error.message)
      }
    })
  }

  getPayementsForApprenant (id: string) {
    this.loading = true
    this.messageInfo = '' // reset à chaque appel
    this.payService.getPayment(id).subscribe({
      next: (paiementsExistants: any) => {
        this.loading = false
        console.log('Paiements récupérés :', paiementsExistants)

        

        this.payment = paiementsExistants.flatMap((paiementTrouve: any) => {
          const formationsInscrites = paiementTrouve.formation
          // Vérifie si le backend a renvoyé un message
          if (paiementTrouve.message) {
            this.messageInfo = paiementTrouve.message
            return []
          }

          if (paiementTrouve.message1) {
            this.messageInfo1 = paiementTrouve.message1
            return []
          }

          // Si plusieurs formations
          if (Array.isArray(formationsInscrites)) {
            return formationsInscrites.map((formation: any) => {
              const paiement = paiementsExistants.find(
                (p: any) => p.formation && p.formation._id === formation._id
              )
              return paiement || this.creerPaiementParDefaut(id, formation)
            })
          }

          // Si une seule formation
          if (formationsInscrites && formationsInscrites._id) {
            const paiement = paiementsExistants.find(
              (p: any) =>
                p.formation && p.formation._id === formationsInscrites._id
            )
            return [
              paiement || this.creerPaiementParDefaut(id, formationsInscrites)
            ]
          }

          return [] // Aucun paiement à retourner si formation invalide
        })
        console.log('user payment', this.payment)
      },
      error: err => {
        this.loading = false
        console.error(
          'Erreur lors de la récupération des paiements :',
          err.error?.message || err.message
        )
      }
    })
  }

  private creerPaiementParDefaut (apprenantId: string, formation: Formation) {
    return {
      apprenant: { _id: apprenantId },
      formation,
      totalAmount: formation.prix,
      montant_restant: formation.prix,
      tranches: [],
      status: 'not_Paid'
    }
  }
  addTranche (apprenantId: string, formationId: string, tranches: any) {
    if (!apprenantId || !formationId) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Informations manquantes pour le paiement.'
      })
      return
    }

    tranches = {
      montant_tranche: this.paymentData.montant_tranche
    }

    this.payService.addPayment(apprenantId, formationId, tranches).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Paiement ajouté',
          text: res.message || 'Paiement mis à jour avec succès.'
        })
        this.getPayementsForApprenant(apprenantId)
      },
      error: err => {
        console.error('❌ Erreur lors du paiement', err)
        this.errorMessage = err.error?.message || 'Erreur inconnue'
        this.showError = true
      }
    })
  }

  confirmPaiement () {
    const apprenantId = this.id
    const formationId = this.selectedFormationId

    if (!apprenantId || !formationId) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une formation et un apprenant.'
      })
      return
    }

    const tranche = {
      montant_tranche: this.paymentData.montant_tranche
    }

    this.payService.addPayment(apprenantId, formationId, tranche).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Paiement confirmé',
          text: res.message || 'Le paiement a été enregistré avec succès.'
        })
        this.getPayementsForApprenant(apprenantId)
      },
      error: err => {
        console.error('❌ Erreur lors du paiement', err)
        this.errorMessage = err.error?.message || 'Erreur inconnue'

        Swal.fire({
          icon: 'warning',
          title: 'Erreur',
          text: this.errorMessage
        })
      }
    })
  }

  getAllPayments () {
    this.payService.getAllPayments().subscribe({
      next: (data: any) => {
        this.payments = data.payments
        this.payments.forEach((payment: any) => {
          this.sommeTranches = payment.tranches.reduce(
            (total: number, tranche: any) =>
              total + (tranche.montant_tranche || 0),
            0
          )
        })
      },
      error: err => {
        console.log(err.error.message)
      }
    })
  }
  
}
