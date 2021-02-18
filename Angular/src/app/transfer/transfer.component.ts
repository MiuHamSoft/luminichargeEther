import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferService } from '../core/blockchain/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  constructor(private transfer: TransferService,
    private snackBar: MatSnackBar) { }

  user: any;
  list: any;

  transactionsList = [];

  t0;
  t1;

  value = '';

  amountInput = new FormControl();

  loading = false;

  isAccountConnected: boolean = false;

  etherCostInMXN = 35207.20;
  etherCostInUSD = 1745.93;

  fuelCost = 600000;

  currentMXNValue = 0;
  currentUSDValue = 0;

  transactionTime = 0;

  ngOnInit(): void {
    this.setFormListeners();
  }

  loadWeb3() {
    // this.t0 = performance.now();
    this.transfer.loadWeb3();
    this.transfer.loadContract().then(() => {
      this.list = this.transfer.list; console.log(this.list)
      this.user = this.transfer.account;
      this.render();
      this.isAccountConnected = true;
      // this.t1 = performance.now();
      // console.log(this.t0 + this.t1);
    });
  }

  async render() {
    this.transactionsList = [];
    // Load the total task count from the blockchain
    if (this.list != undefined) {
      const count = await this.list.transactions();

      // Render out each task with a new task template
      for (var i = 1; i <= count; i++) {
        // Fetch the task data from the blockchain
        const task = await this.list.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]

        let transaction = {
          id: taskId,
          data: taskContent
        }
        this.transactionsList.push(transaction);
      }
    }
  }

  async getPayment() {
    // Load the total task count from the blockchain
    if (this.list != undefined) {
      // Fetch the task data from the blockchain
      const payment = await this.list.payments(this.user)
      console.log(payment.toNumber())
    }
  }

  async chargeFuelNow(amount) {
    var finalAmount = Number(amount) * 1000000000;
    var fuel = (amount / this.fuelCost);
    await this.list.chargeFuelNow(fuel.toFixed(2), { from: this.user, value: finalAmount });
    // this.transfer.setAmount(100);
  }

  timeListener() {
    this.t0 = performance.now();
    this.loading = true;
    this.chargeFuelNow(this.amountInput.value).finally(() => {
      this.t1 = performance.now();
      this.loading = false;
      this.snackBar.open('Transaccion completada', "Cerrar", {
        duration: 2000,
      });
      this.transactionTime = (this.t0 + this.t1);
      this.render();
      console.log(this.transactionTime);
    });
  }

  setFormListeners() {
    this.amountInput.valueChanges.subscribe((val) => {
      this.currentMXNValue = (val / 1000000000) * this.etherCostInMXN;
      this.currentUSDValue = (val / 1000000000) * this.etherCostInUSD;
    });
  }

  setValidators() {
    this.amountInput.setValidators([Validators.compose([Validators.required])]);
  }

}
