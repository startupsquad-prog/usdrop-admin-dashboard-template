import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'

export function generateAvatar(seed: string, size: number = 40) {
  const avatar = createAvatar(micah, {
    seed: seed,
    size: size,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    radius: 50,
  })

  return avatar.toDataUri()
}

export function getUserAvatarUrl(user: { id: string; full_name?: string; email?: string }) {
  // Use user ID as seed for consistent avatars
  const seed = user.id
  
  // Generate avatar with user's ID as seed
  return generateAvatar(seed, 40)
}

export function getInitials(fullName?: string, email?: string) {
  if (fullName && fullName.trim()) {
    const names = fullName.trim().split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  
  if (email) {
    return email[0].toUpperCase()
  }
  
  return '?'
}
