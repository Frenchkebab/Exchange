import { ethers } from 'ethers';
import React from 'react';
import { useExchange } from '../context/ExchangeContext';
import Button from './Button';
import InputField from './InputField';

export default function Exchange() {
  const { ethTokenRate, tokenEthRate, contract } = useExchange();
  const [amount, setAmount] = React.useState(0);
  const [estimatedPriceForSteak, setEstimatedPriceForSteak] =
    React.useState('0');
  const [estimatedPriceForETH, setEstimatedPriceForETH] = React.useState('0');

  async function getEstimatedPriceForSteak() {
    if (contract) {
      try {
        const minTokenPriceInEth = ethTokenRate * amount;
        setEstimatedPriceForSteak(minTokenPriceInEth);
        console.log(
          '🚀 ~ file: Exchange.jsx ~ line 19 ~ getEstimatedPriceForSteak ~ minTokenPriceInEth',
          minTokenPriceInEth
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function getEstimatedPriceForETH() {
    if (contract) {
      try {
        const minETHPriceInToken = tokenEthRate * amount;
        setEstimatedPriceForETH(minETHPriceInToken);
        console.log(
          '🚀 ~ file: Exchange.jsx ~ line 30 ~ getEstimatedPriceForETH ~ minETHPriceInToken',
          minETHPriceInToken
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function tradeETHtoSteak() {
    await getEstimatedPriceForSteak(amount);

    if (contract) {
      try {
        console.log('estimatedPriceForSteak: ', estimatedPriceForSteak);
        await contract.swapETHForTokens(Math.round(ethTokenRate * 1.1), {
          value: ethers.utils.parseUnits(
            estimatedPriceForSteak.toString(),
            'ether'
          )
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function tradeSteakToETH() {
    await getEstimatedPriceForETH(amount);

    if (contract) {
      try {
        console.log('estimatedPriceForETH: ', estimatedPriceForETH.toString());

        await contract.swapTokensForETH(amount, Math.round(tokenEthRate * 1.1));
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => {
          if (
            e.target.value == undefined ||
            e.target.value == null ||
            e.target.value == ''
          ) {
            setAmount('0');
            // setEstimatedPriceForSteak('0');
          } else {
            setAmount(e.target.value);
            // getEstimatedPriceForSteak(e.target.value);
          }
        }}
      />
      <br />
      <Button onClick={() => tradeETHtoSteak()}>Trade ETH to STEAK</Button>
      <br />
      <br />
      <Button onClick={() => tradeSteakToETH()}>Trade STEAK to ETH</Button>
    </div>
  );
}
