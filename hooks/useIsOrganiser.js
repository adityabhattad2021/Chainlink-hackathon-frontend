import { useState } from "react";
import { useAccount } from "wagmi";
import { organiserAddress } from "../constants";

export function useIsOrganiser() {
	const { address: signedInAddress } = useAccount();
	if (organiserAddress == signedInAddress) {
		return true;
	}
	return false;
}
