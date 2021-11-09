# Sending Ether (transfer, send, call)

There are many different function provided by solidity to send and receive `ether`.

In this quest, we will explore those function and decide when to use which function.

## How to send Ether?

You can send Ether to other contracts by using these function:

- `transfer` (2300 gas, throws error)
- `send` (2300 gas, returns bool)
- `call` (forward all gas or set gas, returns bool)

Let's quickly see the syntax of `transfer` and `send` functions'.

Here's how to send `ether` via `transfer`:

```
    function sendViaTransfer(address payable _to) public payable {
        _to.transfer(msg.value);
    }
```

This functin is not recommended for sending `Ether`.

Here's how send `ether` via `send`:

```
    function sendViaSend(address payable _to) public payable {
        // Send returns a boolean value indicating success or failure.
        // This function is not recommended for sending Ether.
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }
```

`send` returns a boolearn value indicating success or failure.
This function is also not recommended for sending `Ether`.

Now let's the recommended way to send `Ether`.

## Recommended way to send ether

`call` in combination with re-entrancy guard is the recommended method to use after December 2019.

Guard against re-entrancy by

- making all state changes before calling other contracts
- using re-entrancy guard modifier

Write this function in `SendEther` contract:

```
    function sendViaCall(address payable _to) public payable {
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
```

- We pass the amount to send in `value` property of `call` function.
- Here we are passing `msg.value` which is the amount the the function will receive when called.
- `call` returns a boolean value indicating success or failure.

Hit `Run`. In the 2nd test output you will see we are transferring 1 ether from one account to another account via this function.
The 2nd account balance increased after the call to `sendViaCall` function and the balance of 1st account decreased.

## How to receive Ether?

A contract receiving Ether must have at least one of the functions below

- `receive() external payable`
- `fallback() external payable`

`receive()` is called if `msg.data` is empty, otherwise `fallback()` is called.

This is how you use `receive()` function. Code this up in `ReceiveEther` contract:

```
    receive() external payable {
        emit Log('receive() fired');
    }
```

And this how you use `fallback()`:

```
    fallback() external payable {
        emit Log('fallback() fired');
    }
```

We have added those Log events so that we can test which function was fired.

Write this `getBalance()` function to test the above function in `ReceiveEther` contract:

```
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
```

Hit `Run`.

- In 3rd test output you will see that contract balance increased after sendTransaction call and `receive()` was fired because `msg.data` was empty.
- In 4th test output you will see that contract balance increased after sendTransaction call and this time `fallback()` was fired because we sent some dummy `msg.data` along with `ether`.
