
const modal = {
    modalOverlay: document.querySelector(".modal-overlay"),
    open() {
        modal.modalOverlay.classList.add("active");
    },

    close() {
        modal.modalOverlay.classList.remove("active");
    }
};


const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("transactions:dev.finances")) || []
    },

    set(transactions) {
        localStorage.setItem("transactions:dev.finances", JSON.stringify(transactions));
    },
}


const Transaction = {
    all: Storage.get(),

    add(transaction /*Parameter of the function */) {
        Transaction.all.push(transaction); //Will add the transaction in the list of transactions, with the command "push".
        App.reload(); //Execute the function to reload the list of transactions to display the new lisft of transactions, but without the removed transaction
    },

    remove(index) {
        Transaction.all.splice(index, 1); //Will remove a transaction on list of transactions, the args is index of the transaction.
        App.reload() //Execute the function to reload the list of transactions to display the new lisft of transactions, but without the removed transaction
    },
    incomes() {
        // code to calc the incomes
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        }); //for each data in a list, do this
        return income;
    },

    expenses() {
        // code to calc the expenses
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense;
    },

    total() {
        // code to calc the total

        let total = Transaction.expenses() + Transaction.incomes();
        total = String(total).replace(/\-/, "")
        total = Number(total);
        return total;
    }
};

// the object with your functions to get the tags/code of index.html to return the original formatted code

const DOM = {
    transationsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transationsContainer.appendChild(tr)
    },
    clearTransactions() {
        DOM.transationsContainer.innerHTML = " ";
    },
    innerHTMLTransaction(transaction, index) {
        // faz a verificação caso o valor da transação for abaixo de 0, a class, será expense, caso for acima, sera income.
        const CSSclasses = transaction.amount < 0 ? "expense" : "income";

        const amount = Utils.formatCurrency(transaction.amount) //executa a formatação dos valores das transações, através da function formatcurreny, dentro do object utils.

        //estrutura que será exibida na data-table.
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" class="remove-transaction" src="./assets/assets/minus.svg" alt=""></td>
    `

        return html
        //retorna para fora toda a estrutura para ser consumida e personalizada.
    },

    updateBalance() {
        document.getElementById('incomedisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expensedisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totaldisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    }
};

const Utils = {
    formatDates(date) {
        const splittedDates = date.split("-");
        return `${splittedDates[2]}/${splittedDates[1]}/${splittedDates[0]}`
    },
    formatAmount(value){

        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value

    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })        

        return signal + value
    }
};

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        };
    },
    validateFields() {
        const { description, amount, date } = Form.getValues();

        if ( description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error("Por favor, preencha todos os campos.")
     }
    },
    formatValues() {
        let { description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        
        date = Utils.formatDates(date);
        return {
            description,
            amount,
            date
        }
    },
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            //verificar se todas as informações estão vazias
            Form.validateFields();
            //formatar os dados para salvar
            const transaction = Form.formatValues();
            //salvar
            Transaction.add(transaction);
            //apagar os dados do formulário
            Form.clearFields();
            //fechar o modal
            modal.close();

        } catch (error) {
            alert(error);
        }
    },

};

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        });
        DOM.updateBalance();

        Storage.set(Transaction.all);
    },

    reload() {
        DOM.clearTransactions()
        App.init();
    },
};

App.init();