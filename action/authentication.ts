"use server";
import { lucia, validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

type LoginProps = {
	username: string;
	password: string;
};
export async function login({ username, password }: LoginProps) {
	if (typeof username !== "string" || username.length < 8) {
		return {
			error: "Invalid username",
		};
	}
	if (typeof password !== "string" || password.length < 8) {
		return {
			error: "Invalid password",
		};
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});
	if (!existingUser) {
		return {
			error: "Incorrect username or password",
		};
	}

	const validPassword = await new Argon2id().verify(
		existingUser.hashed_password,
		password
	);
	if (!validPassword) {
		return {
			error: "Incorrect username or password",
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);
	return redirect("/incoming");
}

type RegisterProps = {
	username: string;
	password: string;
};
export async function register({ username, password }: RegisterProps) {
	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);
	const newUser = await prisma.user.create({
		data: {
			id: userId,
			username: username,
			hashed_password: hashedPassword,
		},
	});

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);
	return redirect("/incoming");
}

export async function logout() {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);
	return redirect("/authentication/login");
}

// Needed for client components
export async function getSession() {
	return await validateRequest();
}
